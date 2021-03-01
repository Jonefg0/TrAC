import DataLoader from "dataloader";
import { Dictionary, groupBy, keyBy, trim } from "lodash";
import { LRUMap } from "lru_map";

import {
  CourseStatsTable,
  CourseTable,
  ICourse,
  EXTERNAL_EVALUATION_STATS_TABLE,
  EXTERNAL_EVALUATION_TABLE,
  EXTERNAL_EVALUATION_STRUCTURE_TABLE,
  ProgramStructureTable,
} from "../db/tables";
import { clearErrorArray } from "../utils/clearErrorArray";

export const CourseRequisitesLoader = new DataLoader(
  async (program_structure_ids: readonly number[]) => {
    const programStructures = await ProgramStructureTable()
      .select("requisites", "id")
      .whereIn("id", program_structure_ids as number[]);

    const data = keyBy(
      await Promise.all<{
        courses: {
          id: number;
          code: string;
        }[];
        id: number;
      }>(
        programStructures.map(async ({ requisites, id }) => {
          const courses = await ProgramStructureTable()
            .select("id", "course_id")
            .whereIn("course_id", requisites?.split(",").map(trim) ?? []);

          return {
            courses: courses.map(({ id, course_id }) => ({
              id,
              code: course_id,
            })),
            id,
          };
        })
      ),
      "id"
    );

    return program_structure_ids.map((key) => {
      return data[key]?.courses;
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const CourseFlowDataLoader = new DataLoader(
  async (keys: readonly { id: number; code: string }[]) => {
    return await Promise.all(
      keys.map(async (key) => {
        const flowData = (
          await ProgramStructureTable()
            .select("id", "course_id", "requisites")
            .whereIn(
              "curriculum",
              ProgramStructureTable().select("curriculum").where({ id: key.id })
            )
        ).map(({ course_id, ...rest }) => ({ ...rest, code: course_id }));

        return flowData
          .filter(({ requisites }) => {
            return requisites.includes(key.code);
          })
          .map(({ id, code }) => ({ id, code }));
      })
    );
  },
  {
    cacheKeyFn: (key) => {
      return key.id + key.code;
    },
    cacheMap: new LRUMap(1000),
  }
);

export const CourseDataLoader = new DataLoader(
  async (ids: readonly string[]) => {
    const dataDict: Dictionary<ICourse | undefined> = keyBy(
      await CourseTable()
        .select("*")
        .unionAll(function () {
          this.select("*").from(EXTERNAL_EVALUATION_TABLE).whereIn("id", ids),
            "id";
        })
        .whereIn("id", ids),
      "id"
    );
    return ids.map((id) => {
      return dataDict[id];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

export const CourseAndStructureDataLoader = new DataLoader(
  async (keys: readonly { id: number; code: string }[]) => {
    const [courseTableData, programStructureData] = await Promise.all([
      CourseDataLoader.loadMany(keys.map(({ code }) => code)),
      ProgramStructureTable()
        .select(
          "id",
          "program_id",
          "curriculum",
          "semester",
          "course_id",
          "credits",
          "requisites",
          "mention",
          "course_cat",
          "mode",
          "credits_sct",
          "tags"
        )
        .unionAll(function () {
          this.select(
            "id",
            "program_id",
            "curriculum",
            "semester",
            "external_evaluation_id",
            "credits",
            "requisites",
            "mention",
            "evaluation_cat",
            "mode",
            "credits_sct",
            "tags"
          )
            .from(EXTERNAL_EVALUATION_STRUCTURE_TABLE)
            .whereIn(
              "id",
              keys.map(({ id }) => id)
            );
        })
        .whereIn(
          "id",
          keys.map(({ id }) => id)
        ),
    ]);

    const hashCourseTableData = keyBy(clearErrorArray(courseTableData), "id");
    const hashProgramStructureData = keyBy(programStructureData, "id");

    return keys.map((key) => {
      return {
        courseTable: hashCourseTableData[key.code],
        programStructureTable: hashProgramStructureData[key.id],
      };
    });
  },
  {
    cacheKeyFn: (key) => {
      return key.id + key.code;
    },
    cacheMap: new LRUMap(5000),
  }
);

export const CourseStatsDataLoader = new DataLoader(
  async (codes: readonly string[]) => {
    const groupedData = groupBy(
      await CourseStatsTable()
        .select("*")
        .unionAll(function () {
          this.select("*")
            .from(EXTERNAL_EVALUATION_STATS_TABLE)
            .whereIn("external_evaluation_taken", codes),
            "external_evaluation_taken";
        })
        .whereIn("course_taken", codes),
      "course_taken"
    );

    return codes.map((code) => {
      return groupedData[code] ?? [];
    });
  },
  {
    cacheMap: new LRUMap(1000),
  }
);

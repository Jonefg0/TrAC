import React, { FC, memo, useCallback, useContext, useMemo } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useWindowSize } from "react-use";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList as ListWindow,
  ListChildComponentProps,
} from "react-window";

import { Stack } from "@chakra-ui/react";

import {
  IGroupedCourse,
  IGroupedExternalEvaluation,
} from "../../../../interfaces";
import { IS_TOUCH_DEVICE } from "../../../constants";
import { ConfigContext } from "../../context/Config";
import { GroupedSemester } from "./GroupedSemester";

export const GroupedSemestersList: FC<{
  semesters: {
    n: number;
    courses: IGroupedCourse[];
    externalEvaluations: IGroupedExternalEvaluation[];
  }[];
}> = memo(({ semesters }) => {
  const { width } = useWindowSize();
  const { DASHBOARD_SEMESTERS_LIST_MOBILE_BREAKPOINT } = useContext(
    ConfigContext
  );
  const isMobile = width < DASHBOARD_SEMESTERS_LIST_MOBILE_BREAKPOINT;

  const SemestersComponent = useMemo(() => {
    return semesters.map(({ n, courses, externalEvaluations }) => (
      <GroupedSemester
        position="absolute"
        left={190 * (n - 1)}
        top={0}
        width={1090}
        courses={courses}
        externalEvaluations={externalEvaluations}
        key={n}
        n={n}
        zIndex={semesters.length - n}
      />
    ));
  }, [semesters]);

  const Column = useCallback<FC<ListChildComponentProps>>(
    ({ index }) => {
      return SemestersComponent[index]!;
    },
    [semesters]
  );

  if (isMobile && IS_TOUCH_DEVICE) {
    return (
      <AutoSizer>
        {({ width }) => {
          return (
            <ListWindow
              layout="horizontal"
              height="90vh"
              width={width}
              itemSize={190}
              itemCount={semesters.length}
              overscanCount={1}
            >
              {Column}
            </ListWindow>
          );
        }}
      </AutoSizer>
    );
  }
  return (
    <ScrollContainer
      hideScrollbars={false}
      vertical={false}
      activationDistance={5}
    >
      <Stack isInline paddingLeft="5px" id="course_plan">
        {semesters.map(({ courses, n, externalEvaluations }, key) => {
          return (
            <GroupedSemester
              key={key}
              courses={courses}
              externalEvaluations={externalEvaluations}
              n={n}
            />
          );
        })}
      </Stack>
    </ScrollContainer>
  );
});

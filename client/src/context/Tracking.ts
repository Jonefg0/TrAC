import { assign, reduce } from "lodash";
import { FC, memo, useCallback, useEffect, useMemo } from "react";
import { createStore } from "react-state-selector";

import { useTrackMutation } from "../graphql";
import { useUser } from "../utils/useUser";

type TrackingTemplateData = {
  program?: string;
  program_menu?: string;
  curriculum?: string;
  admission_type?: string;
  cohort?: string;
  student?: string;
  showingProgress?: boolean;
  showingPrediction?: boolean;
  showingProgressStudenCycle?: boolean;
  showingStudentComplementaryInformation?: boolean;
  showingGroupedComplementaryInfo?: boolean;
  coursesOpen?: string;
  foreplanActive?: boolean;
  foreplanCourses?: string;
  foreplanCredits?: number;
  foreplanSummaryExpanded?: boolean;
  action?: string;
  effect?: string;
  target?: string;
};

const initialState: TrackingTemplateData = Object.freeze({});

export const TrackingStore = createStore(initialState, {
  actions: {
    setTrackingData: (
      data: Omit<TrackingTemplateData, "action" | "effect" | "target">
    ) => (draft) => {
      assign(draft, data);
    },
    track: (data: { action: string; effect: string; target: string }) => (
      draft
    ) => {
      assign(draft, data);
    },
  },
});

export const { setTrackingData, track } = TrackingStore.actions;

export const TrackingManager: FC = memo(() => {
  const state = TrackingStore.useStore();

  const { user } = useUser({
    fetchPolicy: "cache-only",
  });

  const userConfig = useMemo(() => {
    if (!user?.config) return "";
    return reduce(
      user.config,
      (acum, value, key) => {
        if (value) {
          if (key.includes("FOREPLAN") && !user.config.FOREPLAN) {
            return acum;
          }
          acum = acum + (acum !== "" ? "|" : "") + key;
        }
        return acum;
      },
      ""
    );
  }, [user?.config]);

  const trackingTemplate = useCallback(
    ({
      program,
      program_menu,
      curriculum,
      admission_type,
      cohort,
      student,
      showingProgress,
      showingPrediction,
      showingProgressStudenCycle,
      showingStudentComplementaryInformation,
      showingGroupedComplementaryInfo,
      coursesOpen,
      action,
      effect,
      target,
      foreplanActive,
      foreplanCourses,
      foreplanCredits,
      foreplanSummaryExpanded,
    }: TrackingTemplateData) => {
      return `program=${program || null},program-menu=${
        program_menu || null
      },curriculum=${curriculum || null},admission_type=${
        admission_type || null
      },cohort=${cohort || null},student=${student || null},showing-progress=${
        showingProgress ? 1 : 0
      },showing-prediction=${
        showingPrediction ? 1 : 0
      },showing-student-complementary-information=${
        showingStudentComplementaryInformation ? 1 : 0
      },showing-grouped-complementary-info=${
        showingGroupedComplementaryInfo ? 1 : 0
      },showing-progress-student-cycle=${
        showingProgressStudenCycle ? 1 : 0
      },courses-open=${coursesOpen || null},user-config=${
        userConfig || "null"
      },foreplanActive=${foreplanActive ? 1 : 0},foreplanCourses=${
        foreplanCourses || "null"
      },foreplanCredits=${foreplanCredits ?? "null"},foreplanSummaryExpanded=${
        foreplanSummaryExpanded ? 1 : 0
      },action=${action},effect=${effect},target=${target}`;
    },
    [userConfig]
  );

  const [trackMutate] = useTrackMutation({
    ignoreResults: true,
  });

  const trackAction = `${state.action || ""}${state.effect || ""}${
    state.target || ""
  }`;

  useEffect(() => {
    if (trackAction) {
      setTimeout(() => {
        const data = trackingTemplate(state);
        trackMutate({
          variables: {
            data,
            datetime_client: new Date().toISOString(),
          },
        }).catch((err) => {
          console.error(JSON.stringify(err, null, 2));
        });
      }, 0);
    }
  }, [trackAction]);

  return null;
});

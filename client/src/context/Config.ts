import { createContext, createElement, FC, useEffect, useState } from "react";
import { useRememberState } from "use-remember-state";

import { IS_DEVELOPMENT } from "../../constants";
import { baseConfig } from "../../constants/baseConfig";
import {
  failColorScale,
  passColorScale,
} from "../components/dashboard/CourseBox/CourseBoxHelpers";
import {
  scaleAxisX,
  scaleEvaluationAxisX,
  scaleEvaluationGradeAxisX,
  scaleColorX,
} from "../components/dashboard/Histogram/HistogramHelpers";
import {
  GradeScale,
  YAxisScale,
} from "../components/dashboard/Timeline/TimelineHelpers";
import {
  failRateColorScaleNegative,
  failRateColorScalePositive,
} from "../components/foreplan/courseBox/Stats";
import { useConfigQuery } from "../graphql";

export const ConfigContext = createContext(baseConfig);

export const Config: FC = ({ children }) => {
  const [configState, setConfigState] = IS_DEVELOPMENT
    ? useState(baseConfig)
    : useRememberState(`baseConfig=${baseConfig.VERSION_CONFIG}`, baseConfig);

  const { data, loading } = useConfigQuery();

  useEffect(() => {
    if (!loading && data) {
      setConfigState({ ...baseConfig, ...data.config });
    }
  }, [data, loading]);

  passColorScale
    .range([configState.MIN_PASS_SCALE_COLOR, configState.MAX_PASS_SCALE_COLOR])
    .domain([configState.PASS_GRADE, configState.MAX_GRADE]);
  failColorScale
    .range([configState.MIN_FAIL_SCALE_COLOR, configState.MAX_FAIL_SCALE_COLOR])
    .domain([configState.MIN_GRADE, configState.PASS_GRADE]);

  failRateColorScalePositive
    .range([
      configState.FAIL_RATE_COLOR_SCALE_POSITIVE_MIN_COLOR,
      configState.FAIL_RATE_COLOR_SCALE_POSITIVE_MAX_COLOR,
    ])
    .domain([0, 0.3]);
  failRateColorScaleNegative
    .range([
      configState.FAIL_RATE_COLOR_SCALE_NEGATIVE_MIN_COLOR,
      configState.FAIL_RATE_COLOR_SCALE_NEGATIVE_MAX_COLOR,
    ])
    .domain([0.3, 1]);

  scaleColorX
    .range([0, 250])
    .domain([configState.MIN_GRADE, configState.MAX_GRADE]);
  scaleAxisX
    .range([configState.MIN_GRADE, 250])
    .domain([configState.MIN_GRADE, configState.MAX_GRADE]);

  scaleEvaluationAxisX
    .range([configState.MIN_GRADE_EXTERNAL_EVALUATION, 215])
    .domain([
      configState.MIN_GRADE_EXTERNAL_EVALUATION,
      configState.MAX_GRADE_EXTERNAL_EVALUATION,
    ]);

  scaleEvaluationGradeAxisX
    .range([configState.MIN_GRADE_EXTERNAL_EVALUATION, 215])
    .domain([configState.MIN_GRADE_EXTERNAL_EVALUATION, 42]);

  GradeScale.range([40, 170]).domain([
    configState.MAX_GRADE,
    configState.MIN_GRADE,
  ]);
  YAxisScale.range([0, 130]).domain([
    configState.MAX_GRADE,
    configState.MIN_GRADE,
  ]);

  return createElement(ConfigContext.Provider, {
    value: configState,
    children,
  });
};

import { AnimatePresence, motion } from "framer-motion";
import React, { FC, memo, useContext, useEffect, useState } from "react";

import { Flex, Stack, Text } from "@chakra-ui/react";

import { ConfigContext } from "../../context/Config";
import { setTrackingData, track } from "../../context/Tracking";
import { IndicatorTooltip } from "../IndicatorTooltip";

export const GroupedComplementaryInfo: FC<{
  total_students?: number | null;
  timely_university_degree_rate?: number | null;
  university_degree_rate?: number | null;
  retention_rate?: number | null;
  average_time_university_degree?: number | null;
  empleability_rate?: number | null;
  average_time_finding_job?: number | null;
  empleability_rate_educational_system?: number | null;
}> = memo(
  ({
    total_students,
    university_degree_rate,
    average_time_university_degree,
    timely_university_degree_rate,
    retention_rate,
    empleability_rate,
    average_time_finding_job,
    empleability_rate_educational_system,
  }) => {
    const {
      COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR,
      COMPLEMENTARY_INFORMATION_TEXT_COLOR,
      GROUPED_COMPLEMENTARY_INFORMATION,
      COMPLEMENTARY_INFORMATION_YEAR_TEXT,
      COMPLEMENTARY_INFORMATION_PERCENT_MARK,
      GROUPED_COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS,
      GROUPED_COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE,
      GROUPED_COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE,
      GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE,
      GROUPED_COMPLEMENTARY_INFORMATION_RETENTION_RATE,
      GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE,
      GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_FINDING_JOB,
      GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_EDUCATIONAL_SYSTEM,

      GROUPED_COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_FINDING_JOB_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_EDUCATIONAL_SYSTEM_TOOLTIP,
      GROUPED_COMPLEMENTARY_INFORMATION_RETENTION_RATE_TOOLTIP,
    } = useContext(ConfigContext);

    const [show, setShow] = useState(false);

    useEffect(() => {
      setTrackingData({
        showingGroupedComplementaryInfo: show,
      });
    }, [show]);

    return (
      <Flex alignItems="center" ml="1em">
        <Flex
          id="complementary_information"
          backgroundColor={COMPLEMENTARY_INFORMATION_BACKGROUND_COLOR}
          boxShadow={
            show
              ? "0px 0px 2px 1px rgb(174,174,174)"
              : "2px 3px 2px 1px rgb(174,174,174)"
          }
          borderRadius={"5px 5px 5px 5px"}
          alignItems="center"
          onClick={() => {
            setShow((show) => !show);

            track({
              action: "click",
              effect: show
                ? "close-groupedComplementaryInfo"
                : "open-groupedComplementaryInfo",
              target: "groupedComplementaryInfo",
            });
          }}
          color={COMPLEMENTARY_INFORMATION_TEXT_COLOR}
          cursor="pointer"
          transition="box-shadow 0.2s ease-in-out"
          data-testid="BoxContainer"
        >
          <Stack
            alignItems="center"
            className="unselectable"
            isInline
            pt={10}
            pb={10}
            fontFamily="Lato"
          >
            <Text
              minWidth="90px"
              height="150px"
              m={0}
              ml={4}
              textAlign="center"
              fontWeight="bold"
              className="verticalText"
              fontSize="1.1em"
            >
              {GROUPED_COMPLEMENTARY_INFORMATION}
            </Text>
            <AnimatePresence>
              {show && (
                <motion.div
                  key="employed-text"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  {total_students && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {GROUPED_COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS}{" "}
                        {total_students}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_TOTAL_STUDENTS_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {timely_university_degree_rate && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {
                          GROUPED_COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE
                        }{" "}
                        {total_students}
                        {COMPLEMENTARY_INFORMATION_PERCENT_MARK}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_TIMELY_UNIVERSITY_DEGREE_RATE_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {university_degree_rate && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {
                          GROUPED_COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE
                        }{" "}
                        {total_students}
                        {COMPLEMENTARY_INFORMATION_PERCENT_MARK}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_UNIVERSITY_DEGREE_RATE_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {average_time_university_degree && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {
                          GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE
                        }{" "}
                        {total_students} {COMPLEMENTARY_INFORMATION_YEAR_TEXT}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_UNIVERSITY_DEGREE_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}

                  {retention_rate && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {GROUPED_COMPLEMENTARY_INFORMATION_RETENTION_RATE}{" "}
                        {total_students}
                        {COMPLEMENTARY_INFORMATION_PERCENT_MARK}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_RETENTION_RATE_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}
                  {empleability_rate && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE}{" "}
                        {total_students}
                        {COMPLEMENTARY_INFORMATION_PERCENT_MARK}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}
                  {average_time_finding_job && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {
                          GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_FINDING_JOB
                        }{" "}
                        {total_students} {COMPLEMENTARY_INFORMATION_YEAR_TEXT}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_AVERAGE_TIME_FINDING_JOB_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}
                  {empleability_rate_educational_system && (
                    <Flex minWidth="max-content" pr={5} pl={5} pt={1} pb={1}>
                      <Text>
                        {
                          GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_EDUCATIONAL_SYSTEM
                        }{" "}
                        {total_students}
                        {COMPLEMENTARY_INFORMATION_PERCENT_MARK}
                      </Text>
                      <IndicatorTooltip
                        tooltipShow={
                          GROUPED_COMPLEMENTARY_INFORMATION_EMPLEABILITY_RATE_EDUCATIONAL_SYSTEM_TOOLTIP
                        }
                      ></IndicatorTooltip>
                    </Flex>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Flex>
      </Flex>
    );
  }
);

export default GroupedComplementaryInfo;

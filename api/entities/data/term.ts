import { Field, Int, ObjectType, registerEnumType } from "type-graphql";

import { TermType } from "../../../client/constants";
import { TakenCourse } from "./takenCourse";
import { TakenExternalEvaluation } from "./takenExternalEvaluation";

registerEnumType(TermType, {
  name: "TermType",
  description:
    "Possible states of a term, first semester, second semester or anual",
});

@ObjectType({ simpleResolvers: true })
export class Term {
  // student_term => program_id
  @Field()
  program_id: string;

  // student_term => id
  @Field(() => Int)
  id: number;

  // student_term => student_id
  @Field()
  student_id: string;

  // student_term => year
  @Field(() => Int)
  year: number;

  // student_term => term
  @Field(() => TermType)
  term: TermType;

  // student_term => situation
  @Field()
  situation: string;

  // student_term => comments
  @Field()
  comments: string;

  // student_term => t_gpa
  @Field()
  semestral_grade: number;

  // student_term => c_gpa
  @Field()
  cumulated_grade: number;

  // program_last_gpa
  @Field()
  program_grade: number;

  // student_course => *
  @Field(() => [TakenCourse])
  takenCourses: TakenCourse[];

  // student_external_evaluation => *
  @Field(() => [TakenExternalEvaluation])
  takenExternalEvaluations: TakenExternalEvaluation[];
}

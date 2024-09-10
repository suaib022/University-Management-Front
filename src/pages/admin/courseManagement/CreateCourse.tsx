import React from "react";
import {
  useAddCourseMutation,
  useGetAllCoursesQuery,
} from "../../../redux/features/admin/courseManagement";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { TResponse } from "../../../types";
import { Button, Col, Flex } from "antd";
import UniForm from "../../../components/form/UniForm";
import UniInput from "../../../components/form/UniInput";
import UniSelect from "../../../components/form/UniSelect";

const CreateCourse = () => {
  const [createCourse] = useAddCourseMutation();
  const { data: courses } = useGetAllCoursesQuery(undefined);

  const preRequisiteCoursesOptions = courses?.data?.map((item) => ({
    value: item._id,
    label: item.title,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const courseData = {
      ...data,
      code: Number(data.code),
      credits: Number(data.credits),
      isDeleted: false,
      preRequisiteCourses: data.preRequisiteCourses
        ? data.preRequisiteCourses?.map((item) => ({
            course: item,
            isDeleted: false,
          }))
        : [],
    };

    console.log(courseData);

    try {
      const res = (await createCourse(courseData)) as TResponse<any>;
      console.log(res);
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Course created", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong !", { id: toastId });
    }
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <UniForm onSubmit={onSubmit}>
          <UniInput type="text" name="title" label="Title" />
          <UniInput type="text" name="prefix" label="Prefix" />
          <UniInput type="text" name="code" label="Code" />
          <UniInput type="text" name="credits" label="Credits" />
          <UniSelect
            mode="multiple"
            options={preRequisiteCoursesOptions}
            name="preRequisiteCourses"
            label="preRequisiteCourses"
          />
          <Button htmlType="submit">Submit</Button>
        </UniForm>
      </Col>
    </Flex>
  );
};

export default CreateCourse;

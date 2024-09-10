import { useAddRegisteredSemesterMutation } from "../../../redux/features/admin/courseManagement";
import { useGetAllSemestersQuery } from "../../../redux/features/admin/academicManagement";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { TResponse } from "../../../types";
import { Button, Col, Flex } from "antd";
import UniForm from "../../../components/form/UniForm";
import UniSelect from "../../../components/form/UniSelect";
import { semesterStatusOptions } from "../../../constants/semester";
import UniDatePicker from "../../../components/form/UniDatePicker";
import UniInput from "../../../components/form/UniInput";

const SemesterRegistration = () => {
  const [addSemester] = useAddRegisteredSemesterMutation();
  const { data: allAcademicSemesters } = useGetAllSemestersQuery([
    { name: "sort", value: "year" },
  ]);

  const academicSemesterOptions = allAcademicSemesters?.data?.map((item) => ({
    value: item._id,
    label: `${item.name} ${item.year}`,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const semesterData = {
      ...data,
      minCredit: Number(data.minCredit),
      maxCredit: Number(data.maxCredit),
    };

    console.log({ semesterData });

    try {
      const res = (await addSemester(semesterData)) as TResponse<any>;
      console.log({ res });

      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Semester created", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };
  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <UniForm onSubmit={onSubmit}>
          <UniSelect
            label="Academic Semester"
            name="academicSemester"
            options={academicSemesterOptions}
          />
          <UniSelect
            name="status"
            label="Status"
            options={semesterStatusOptions}
          />
          <UniDatePicker name="startDate" label="Start Date" />
          <UniDatePicker name="endDate" label="End Date" />
          <UniInput type="number" name="minCredit" label="Min Credit" />
          <UniInput type="number" name="maxCredit" label="Max Credit" />
          <Button htmlType="submit">Submit</Button>
        </UniForm>
      </Col>
    </Flex>
  );
};

export default SemesterRegistration;

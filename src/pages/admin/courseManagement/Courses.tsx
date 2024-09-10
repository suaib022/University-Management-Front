import { useState } from "react";
import {
  useAddFacultiesMutation,
  useGetAllCoursesQuery,
} from "../../../redux/features/admin/courseManagement";
import { useGetAllFacultiesQuery } from "../../../redux/features/admin/userManagement";
import { Button, Modal, Table } from "antd";
import UniForm from "../../../components/form/UniForm";
import UniSelect from "../../../components/form/UniSelect";

const Courses = () => {
  const { data: courses, isFetching } = useGetAllCoursesQuery(undefined);

  const tableData = courses?.data?.map(({ _id, title, prefix, code }) => ({
    key: _id,
    title,
    code: `${prefix}${code}`,
  }));

  const columns = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Code",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return <AddFacultyModal facultyInfo={item} />;
      },
    },
  ];
  return (
    <Table loading={isFetching} columns={columns} dataSource={tableData} />
  );
};

const AddFacultyModal = ({ facultyInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: facultiesData } = useGetAllFacultiesQuery(undefined);
  const [addFaculties] = useAddFacultiesMutation();

  const facultiesOption = facultiesData?.data?.map((item) => ({
    value: item._id,
    label: item.fullName,
  }));

  const handleSubmit = (data) => {
    const facultyData = {
      courseId: facultyInfo.key,
      data,
    };

    addFaculties(facultyData);

    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>Add Faculty</Button>
      <Modal
        title="Assign Faculties"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <UniForm onSubmit={handleSubmit}>
          <UniSelect
            mode="multiple"
            options={facultiesOption}
            name="faculties"
            label="Faculty"
          />
          <Button htmlType="submit">Submit</Button>
        </UniForm>
      </Modal>
    </>
  );
};

export default Courses;

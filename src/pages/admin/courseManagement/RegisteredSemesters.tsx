import { useState } from "react";
import {
  useGetAllRegisteredSemestersQuery,
  useUpdateRegisteredSemesterMutation,
} from "../../../redux/features/admin/courseManagement";
import moment from "moment";
import { Button, Dropdown, Table, TableColumnsType, Tag } from "antd";
import { TSemester } from "../../../types/courseManagement.type";

export type TTableData = Pick<TSemester, "startDate" | "endDate" | "status">;

const items = [
  {
    label: "Upcoming",
    key: "UPCOMING",
  },
  {
    label: "Ongoing",
    key: "ONGOING",
  },
  {
    label: "Ended",
    key: "ENDED",
  },
];

const RegisteredSemesters = () => {
  const [semesterId, setSemesterId] = useState("");

  console.log({ semesterId });
  const { data: semesterData, isFetching } =
    useGetAllRegisteredSemestersQuery(undefined);
  const [updateSemesterStatus] = useUpdateRegisteredSemesterMutation();

  const tableData = semesterData?.data?.map(
    ({ _id, academicSemester, startDate, endDate, status }) => ({
      key: _id,
      name: `${academicSemester.name} ${academicSemester.year}`,
      startDate: moment(new Date(startDate)).format("MMMM"),
      endDate: moment(new Date(endDate)).format("MMMM"),
      status,
    })
  );

  const handleStatusUpdate = (data) => {
    const updateData = {
      id: semesterId,
      data: {
        status: data.key,
      },
    };

    updateSemesterStatus(updateData);
  };

  const menuProps = {
    items,
    onClick: handleStatusUpdate,
  };

  const columns: TableColumnsType<TTableData> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (item) => {
        let color;
        if (item === "UPCOMING") {
          color = "blue";
        }
        if (item === "ONGOING") {
          color = "green";
        }
        if (item === "ENDED") {
          color = "red";
        }

        return <Tag color={color}>{item}</Tag>;
      },
    },
    {
      title: "Start Date",
      key: "startDate",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      key: "endDate",
      dataIndex: "endDate",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button onClick={() => setSemesterId(item.key)}>Update</Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table loading={isFetching} columns={columns} dataSource={tableData} />
  );
};

export default RegisteredSemesters;

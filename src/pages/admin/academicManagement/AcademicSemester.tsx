import { useGetAllSemestersQuery } from "../../../redux/features/acdemicSemester/academicSemesterApi";

const AcademicSemester = () => {
  const { data } = useGetAllSemestersQuery(undefined);
  console.log("Semesters : ", data);

  return (
    <div>
      <h1>All Academic Semesters</h1>
    </div>
  );
};

export default AcademicSemester;

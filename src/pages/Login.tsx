import { FieldValues, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { setUser, TUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { Button, Row } from "antd";
import { useNavigate } from "react-router-dom";
import UniForm from "../components/form/UniForm";
import UniInput from "../components/form/UniInput";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { register, handleSubmit } = useForm({
  //   defaultValues: {
  //     userId: "A-0001",
  //     password: "admin123",
  //   },
  // });

  const defaultValues = {
    userId: "A-0001",
    password: "admin123",
  };

  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    try {
      const toastId = toast.loading("Logging In...");
      const userInfo = {
        id: data.userId,
        password: data.password,
      };

      const res = await login(userInfo).unwrap();
      const accessToken = res.data.accessToken;
      const user = verifyToken(accessToken) as TUser;

      dispatch(setUser({ user: user, token: accessToken }));
      toast.success("Logged In Successfully !", {
        id: toastId,
        duration: 2000,
      });
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }

    // console.log("userInfo: ", userInfo);
    // const res = await login(userInfo).unwrap();
    // const user = verifyToken(res.data.accessToken);
    // dispatch(setUser({ user: user, token: res.data.accessToken }));
  };
  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <div>
    //     <label htmlFor="id">ID: </label>
    //     <input type="text" id="id" {...register("userId")} />
    //   </div>
    //   <div>
    //     <label htmlFor="password">Password: </label>
    //     <input type="text" id="password" {...register("password")} />
    //   </div>
    //   <Button htmlType="submit">Login</Button>
    // </form>
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <UniForm onSubmit={onSubmit} defaultValues={defaultValues}>
        <UniInput type="text" name="userId" label="ID :"></UniInput>
        <UniInput type="text" name="password" label="Password :"></UniInput>
        <Button htmlType="submit">Login</Button>
      </UniForm>
    </Row>
  );
};

export default Login;

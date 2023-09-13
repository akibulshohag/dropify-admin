import React, { useLayoutEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb } from "../../components/index";
import axios from "../../../axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import IOSSwitch from "../../Shared/Forms/iosSwitch";

const UpdateAttribute = () => {
  const { attributeId } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
  });

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useLayoutEffect(() => {
    let fetchData = async () => {
      let res = await axios.get("/attribute/single-fetch/" + attributeId);
      console.log(res?.data?.data);
      setValue("name", res?.data?.data?.name);
      setIsDisabled(res?.data?.data?.isDisabled);
    };
    fetchData();
  }, [attributeId, setValue]);

  const formSubmitHandler = async (data) => {
    setIsLoading(true);
    try {
      const createRes = await axios.patch(`/attribute/update-name/${attributeId}`, {
        name: data.name,
        isDisabled,
      });
      if (createRes?.data?.success) {
        openNotificationWithIcon(createRes?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (error) {
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Attribute List", path: "/attribute-list" },
            { name: "Update Attribute Value" },
          ]}
        />
      </div>

      <Grid container>
        <Grid item md={6} xs={12}>
          <Card elevation={3}>
            <div className="flex p-4" style={{ backgroundColor: "#e3e6e4" }}>
              <h4 className="m-0">Update Attribute</h4>
            </div>
            <Divider className="mb-6" />

            <form className="px-4" onSubmit={handleSubmit(formSubmitHandler)}>
              <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      Name<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      className="mt-2"
                      name="name"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register("name")}
                    />
                    <p style={{ color: "red" }}>
                      <small>{errors.name?.message}</small>
                    </p>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={!isDisabled}
                          onClick={() => setIsDisabled(!isDisabled)}
                        />
                      }
                      label={isDisabled ? "Disable" : "Enable"}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Button
                className="mb-4 mt-2 px-12"
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: "20px" }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update Attribute"}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateAttribute;

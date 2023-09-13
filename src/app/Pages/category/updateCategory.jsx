import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Icon,
  TextField,
  Box,
  CardHeader,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { notification, Typography } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { Upload } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import IOSSwitch from "../../Shared/Forms/iosSwitch";
import { useParams } from "react-router-dom";
import imageBasePath from "../../../config";
import { convertImageToBase64 } from "../../util/convertImageToBase64";

const CategoryForm = () => {
  const { categoryId } = useParams();

  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [fileError, setFileError] = useState("");
  const [parentCatOption, setParentCatOption] = useState([]);
  const [parentId, setParentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("name is required")
      .min(3, "too small name, minimum 3 character")
      .max(40, "too big name, maximum 40 character "),
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
    let fetchCategoryData = async () => {
      let res = await axios.get("/category/single-fetch/" + categoryId);
      console.log("res: ", res);
      setValue("name", res?.data?.data?.name);
      // setIsDisabled(res?.data?.data?.isDisabled);
      setIsFeatured(res?.data?.data?.isFeatured);
      setParentId(res?.data?.data?.parentId ? res?.data?.data?.parentId : "");
      setCategoryData(res?.data?.data);

      let imageArray = [];
      if (res?.data?.data?.image !== "") {
        imageArray = [
          {
            url: imageBasePath + "/" + res?.data?.data?.image,
          },
        ];
      }

      setFileList(imageArray);
    };

    fetchCategoryData();
  }, [categoryId, setValue]);

  useEffect(() => {
    if (categoryData) {
      let fetchData = async () => {
        let res = await axios.get("/category/fetch-all");

        let parentCategoryObj = [];
        for (let parent of res?.data?.data) {
          if (parent.parentId === null && categoryData?._id !== parent?._id) {
            parentCategoryObj.push({
              _id: parent._id,
              name: parent.name,
            });
          }
        }
        setParentCatOption(parentCategoryObj);
      };

      fetchData();
    }
  }, [categoryData]);

  const formSubmitHandler = async (data) => {
    try {
      if (fileError) return;

      let baseImg = "";
      if (selectedFile) {
        baseImg = await convertImageToBase64(selectedFile);
      } else if (fileList.length > 0) {
        baseImg = fileList[0].url.split(imageBasePath + "/")[1];
      }

      let obj = {
        parentId: parentId,
        name: data.name,
        image: baseImg,
        isFeatured: isFeatured,
      };
      console.log("obj: ", obj);

      setIsLoading(true);
      const res = await axios.patch(`/category/update/${categoryId}`, obj);
      if (res?.data?.success) {
        if (parentId === "") {
          setParentCatOption([
            ...parentCatOption,
            {
              _id: res?.data?.data?._id,
              name: data?.name,
            },
          ]);
        }

        openNotificationWithIcon(res?.data?.message, "success");
      } else {
        openNotificationWithIcon(res?.data?.message, "error");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  const imageHandler = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length === 0) {
      setFileError("");
    } else if (
      newFileList[0]?.originFileObj.type === "image/jpeg" ||
      newFileList[0]?.originFileObj.type === "image/jpg" ||
      newFileList[0]?.originFileObj.type === "image/png"
    ) {
      setSelectedFile(newFileList[0]?.originFileObj);
      setFileError("");
    } else {
      setFileError("Image must be (jpeg, jpg or png) format!");
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Category List", path: "/category-list" },
            { name: "New Category" },
          ]}
        />
      </div>

      <Grid container>
        <Grid item md={6} xs={12}>
          <Card elevation={3}>
            <CardHeader title="Add New Category" />

            <form className="px-4 py-6" onSubmit={handleSubmit(formSubmitHandler)}>
              <Grid container spacing={3}>
                <Grid item sm={8} xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      Parent Category<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      select
                      name="parentId"
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={(e) => setParentId(e.target.value)}
                      value={parentId}
                    >
                      <MenuItem value="">--select one--</MenuItem>
                      {parentCatOption.map((p) => (
                        <MenuItem key={p._id} value={p._id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="label" className="mb-2">
                      {parentId ? "Sub Category Name" : "Category Name"}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
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
                    <Typography variant="label" className="mb-2">
                      Upload Image<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Upload listType="picture-card" fileList={fileList} onChange={imageHandler}>
                      {fileList.length >= 1 ? null : (
                        <span>
                          <Icon style={{ color: "gray" }}>photo_size_select_actual</Icon>
                        </span>
                      )}
                    </Upload>

                    <p style={{ color: "red" }}>
                      <small>{fileError}</small>
                    </p>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          onClick={() => setIsFeatured(!isFeatured)}
                          checked={isFeatured ? true : false}
                        />
                      }
                      label={isFeatured === true ? `Feature on` : `Feature off`}
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Category"}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryForm;

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "../../../axios";
import imageBasePath from "../../../config";
import SimpleModal from "../../Shared/SimpleModal/SimpleModal";
import Spinner from "../../Shared/Spinner/Spinner";
import { Breadcrumb } from "../../components";

export default function CustomerList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [rows, setRows] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openImgData, setOpenImgData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const columns = [
    {
      id: "image",
      label: "Image",
      minWidth: 100,
      format: (value) => (
        <Avatar
          src={imageBasePath + "/" + value?.image}
          alt={value?.name}
          className="border-radius-4"
          style={{ cursor: "pointer", width: "58px" }}
          onClick={() => openImgHandler({ image: value?.image, name: value?.name })}
        />
      ),
    },
    {
      id: "name",
      label: "Name",
      minWidth: 100,
    },
    {
      id: "phone",
      label: "Phone",
      minWidth: 120,
    },
    {
      id: "totalBuy",
      label: "Total Buy",
      minWidth: 100,
    },
    {
      id: "address",
      label: "Address",
      minWidth: 150,
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        let res = null;
        setIsLoading(true);
        if (searchValue !== "") {
          res = await axios.post(
            `/customer/fetch-by-phone-or-name?page=${page + 1}&limit=${rowsPerPage}`,
            {
              value: searchValue,
            }
          );
        } else {
          res = await axios.get(`/customer/fetch-all?page=${page + 1}&limit=${rowsPerPage}`);
        }

        if (res?.data?.data) {
          setTotalData(res?.data?.metaData?.totalData);
          let dataArray = [];
          for (let data of res?.data?.data) {
            dataArray.push({
              _id: data?._id,
              image: {
                name: data?.name,
                image: data?.image,
              },
              name: data?.name,
              phone: data?.phone,
              totalBuy: data?.totalBuy || 0,
              address:
                (data?.address?.details && data?.address?.details + " - ") +
                (data?.address?.upazila && data?.address?.upazila + ", ") +
                (data?.address?.district && data?.address?.district + ", ") +
                data?.address?.division,
            });
          }
          setRows(dataArray);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(err?.response?.data?.message);
      }
    };

    fetchData();
  }, [page, rowsPerPage, searchValue]);

  const closeModalHandler = () => {
    setIsOpenModal(false);
    setOpenImgData(null);
  };

  const openImgHandler = (data) => {
    setIsOpenModal(true);
    setOpenImgData(data);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Customer List" }]} />
      </div>
      <Card className="border-radius-0 mx-8">
        <CardHeader title="Customer List" />
        <div className="w-full overflow-hidden px-2 mt-4">
          <Box
            sx={{
              borderBottom: "1px solid #F6F6F6",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <Box>
              <Typography paragraph>{`Registered customer: ${totalData || 0} `}</Typography>
            </Box>
            <Box>
              <TextField
                label=""
                placeholder="Search by phone"
                size="small"
                variant="outlined"
                fullWidth
                className="min-w-240"
                onChange={(e) => {
                  setPage(0);
                  setSearchValue(e.target.value);
                }}
                value={searchValue}
              />
            </Box>
          </Box>
        </div>
        <Divider />
      </Card>
      <Card className="border-radius-0 mx-8">
        {!isLoading ? (
          <div className="w-full overflow-hidden px-2">
            {rows.length > 0 && errorMsg === "" ? (
              <>
                <div
                  style={{
                    maxHeight: 800,
                    overflow: "auto",
                  }}
                >
                  <Table stickyHeader className="whitespace-pre">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format ? column.format(value, row?.name) : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalData} // total data
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Typography
                variant="body2"
                style={{
                  textAlign: "center",
                  color: "gray",
                  paddingY: "14px",
                  padding: "8px",
                }}
              >
                No Data Found
              </Typography>
            )}
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "auto",
              width: "auto",
              marginY: "58px",
            }}
          >
            <Spinner />
          </Box>
        )}
      </Card>
      <SimpleModal isShow={isOpenModal} closeModalHandler={closeModalHandler}>
        <Avatar
          className="border-radius-4"
          style={{ width: "100%", height: "100%" }}
          src={imageBasePath + "/" + openImgData?.image}
          alt={openImgData?.name}
        />
      </SimpleModal>
    </div>
  );
}

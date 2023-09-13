import React, { useLayoutEffect, useState } from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { notification } from "antd";
import axios from "../../../../../axios";
import moment from "moment";

const AddAdminNote = ({ purchaseNoteData, closeModalHandler, dataList, setDataList }) => {
  const [noteValue, setNoteValue] = useState("");
  const [noteList, setNoteList] = useState([]);

  useLayoutEffect(() => {
    if (purchaseNoteData) {
      setNoteList(purchaseNoteData?.notes);
    }
  }, [purchaseNoteData]);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const addNoteHandler = async () => {
    try {
      let obj = {
        note: noteValue,
        time: new Date(),
      };
      let res = await axios.patch(`/purchase/add-purchase-note/${purchaseNoteData?._id}`, obj);
      if (res) {
        setDataList(
          dataList.map((data) =>
            data?._id === purchaseNoteData?._id ? { ...data, adminNote: res?.data?.data } : data
          )
        );
        setNoteList(res?.data?.data);
        setNoteValue("");
      }
    } catch (err) {
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  return (
    <div>
      <p>
        ID: <strong className="text-secondary">{" " + purchaseNoteData?.serialId}</strong>
      </p>
      <Grid container spacing={2} className="border">
        <Grid item lg={8}>
          <TextField
            label=""
            placeholder=""
            name="name"
            size="small"
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
          />
        </Grid>
        <Grid item lg={4}>
          <Button
            style={{
              backgroundColor: "#FF8E96",
              color: "white",
            }}
            variant="contained"
            fullWidth
            onClick={addNoteHandler}
          >
            Add Note
          </Button>
        </Grid>
      </Grid>
      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {noteList.length > 0 && (
          <Table stickyHeader className="whitespace-pre mt-4">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {noteList &&
                noteList.map((data, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="left">
                      <p style={{ maxWidth: "75px" }} className="m-0 p-0 text-gray">
                        <small> {moment(data?.time).format("LT")}</small>
                        <br />
                        <small> {moment(data?.time).format("LL")}</small>
                      </p>
                    </TableCell>
                    <TableCell align="left">
                      <p className="m-0"> {data?.message}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AddAdminNote;

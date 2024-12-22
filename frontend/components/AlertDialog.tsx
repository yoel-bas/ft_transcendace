import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import {getCookies} from "../components/auth";
import { ToastContainer, toast} from "react-toastify";
import { useTranslation } from "react-i18next";
import { useChatContext } from '../components/context/ChatContext';

export default function AlertDialog({showBlockDialog, setShowBlockDialog}) {
  const [open, setOpen] = React.useState(true);
  const {otherUser} = useChatContext()
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowBlockDialog(false)
  };

  const handleBlock = async () => {
    const body = {
      username: otherUser?.username
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post('https://localhost/api/auth/block/', body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(t("User blocked successfully"))
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
    setOpen(false);
    setShowBlockDialog(false)
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("Block") + " " + otherUser?.full_name + "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("By blocking this contact, you will no longer receive messages or any form of communication from them. Are you sure you want to block this contact?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("Cancel")}</Button>
          <Button onClick={handleBlock} autoFocus>
            {t("Block")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
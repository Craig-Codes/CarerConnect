import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface WarningModalProps {
  open: boolean; // Accept the modal open state as a prop
  handleClose: (remove: boolean) => void; // Handle close passed from the parent
  title: string;
  content: string;
}

export const WarningModal = ({
  open,
  handleClose,
  title,
  content,
}: WarningModalProps) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open} // Control modal visibility with this prop
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {content}
          </Typography>
          <Box sx={{ paddingTop: "25px" }}>
            <Button onClick={() => handleClose(true)}>Yes</Button>
            <Button onClick={() => handleClose(false)}>Cancel</Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

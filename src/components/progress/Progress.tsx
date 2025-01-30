import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Progress({
  open,
}: {
  open: boolean;
}) {
  if (!open) return null;

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', flexDirection: 'column' }}
      open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

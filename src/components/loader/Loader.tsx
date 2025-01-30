import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({
  open,
  label,
}: {
  open: boolean;
  label?: string;
}) {
  if (!open) return null;

  return (
    <>
      <CircularProgress color="secondary" />
      {label && (
        <Typography gutterBottom  sx={{  p: 2, fontSize: "14px" }}>
          {label}
        </Typography>
      )}
    </>
  );
}

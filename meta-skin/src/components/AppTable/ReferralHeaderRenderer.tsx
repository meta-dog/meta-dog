import { RestartAlt } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";

export default function ReferralHeaderRenderer(handleResetClick: () => void) {
  return (
    <Stack direction="row" className="flex justify-center items-center">
      <Typography variant="body2" fontWeight={500}>
        Get
      </Typography>
      <Box>
        <IconButton
          size="small"
          sx={{ "& .MuiSvgIcon-root": { fontSize: "initial" } }}
          onClick={handleResetClick}
        >
          <RestartAlt />
        </IconButton>
      </Box>
    </Stack>
  );
}

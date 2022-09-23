import { RestartAlt } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ReferralHeaderRenderer(
  name: string,
  handleResetClick: () => void,
) {
  const { t } = useTranslation("appTableReferralHeader");

  return (
    <Stack direction="row" className="flex justify-center items-center">
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ lineHeight: "initial" }}
      >
        {name}
      </Typography>
      <Box>
        <Tooltip title={t("tooltip.reset-saved-apps")}>
          <IconButton
            aria-label={t("button.reset.aria-label")}
            size="small"
            sx={{ "& .MuiSvgIcon-root": { fontSize: "initial" } }}
            onClick={handleResetClick}
          >
            <RestartAlt />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
}

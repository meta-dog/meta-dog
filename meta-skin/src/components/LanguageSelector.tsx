import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AvailableLanguages, fallbackLng as languages } from "translations";

export default function LanguageSelector(sx: SxProps<Theme>) {
  const { t, i18n } = useTranslation("languageSelector");

  const handleChange = ({ target }: SelectChangeEvent<AvailableLanguages>) => {
    i18n.changeLanguage(target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select
        value={i18n.resolvedLanguage as AvailableLanguages}
        onChange={handleChange}
        color="secondary"
        sx={sx}
      >
        {languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {t("language", { context: lang })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

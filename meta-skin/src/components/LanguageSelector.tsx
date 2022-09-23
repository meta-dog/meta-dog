import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AvailableLanguages, fallbackLng as languages } from "translations";

interface Props {
  color?: string;
}

export default function LanguageSelector({ color = "initial" }: Props) {
  const { t, i18n } = useTranslation("languageSelector");

  const handleChange = ({ target }: SelectChangeEvent<AvailableLanguages>) => {
    i18n.changeLanguage(target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
      <Select
        value={i18n.resolvedLanguage as AvailableLanguages}
        onChange={handleChange}
        color="secondary"
        sx={{ color, textAlign: "center" }}
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

LanguageSelector.defaultProps = { color: "initial" };

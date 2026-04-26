import { useContext } from "react";
import { Tabs, Tab, SxProps, Theme } from "@mui/material";
import {
  Star as StarIcon,
  NearMe as NearMeIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { RouteCollection } from "../../@types/types";
import CollectionContext from "../../CollectionContext";
import { useHorizontalWheelScroll } from "../../hooks/useHorizontalWheelScroll";

interface HomeTabbarProps {
  homeTab: HomeTabType | string;
  onChangeTab: (v: HomeTabType, rerenderList: boolean) => void;
}

const HomeTabbar = ({ homeTab, onChangeTab }: HomeTabbarProps) => {
  const { t } = useTranslation();
  const { collections } = useContext(CollectionContext);
  useHorizontalWheelScroll();

  return (
    <Tabs
      value={homeTab}
      onChange={(_, v) => onChangeTab(v, true)}
      sx={tabbarSx}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
    >
      <Tab
        iconPosition="start"
        icon={<NearMeIcon />}
        label={t("附近")}
        value="nearby"
        disableRipple
      />
      <Tab
        iconPosition="start"
        icon={<StarIcon />}
        label={t("常用")}
        value="saved"
        disableRipple
      />
      <Tab
        iconPosition="start"
        icon={<BookmarkIcon />}
        label={t("Collections")}
        value="collections"
        disableRipple
      />
      {collections.map((collection, idx) => (
        <Tab
          key={`collection-${idx}`}
          label={collection.name}
          value={collection.name}
          disableRipple
        />
      ))}
    </Tabs>
  );
};

export default HomeTabbar;

export type HomeTabType = "saved" | "nearby" | "collections";

export const isHomeTab = (
  input: unknown,
  collections: RouteCollection[]
): input is HomeTabType => {
  if (input === "saved" || input === "nearby" || input === "collections") {
    return true;
  }
  for (let i = 0; i < collections.length; ++i) {
    if (input === collections[i].name) {
      return true;
    }
  }
  return false;
};

const tabbarSx: SxProps<Theme> = {
  background: (theme) =>
    theme.palette.mode === "light" ? "#fff" : theme.palette.background.default,
  minHeight: "40px",
  borderBottom: (theme) =>
    theme.palette.mode === "light"
      ? "1px solid rgba(0,0,0,0.08)"
      : "1px solid rgba(255,255,255,0.08)",
  "& .MuiTabs-indicator": {
    height: "3px",
    borderRadius: "3px 3px 0 0",
    backgroundColor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.primary.main : "#111",
  },
  [`& .MuiTab-root`]: {
    textTransform: "none",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "6px",
    paddingBottom: "6px",
    paddingLeft: "12px",
    paddingRight: "12px",
    minHeight: "40px",
    color: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(0,0,0,0.5)"
        : "rgba(255,255,255,0.5)",
    "&.Mui-selected": {
      color: (theme) =>
        theme.palette.mode === "dark" ? theme.palette.primary.main : "#111",
      fontWeight: 700,
    },
    transition: "color 0.15s ease",
  },
  [`& .MuiTabs-flexContainer`]: {
    justifyContent: "flex-start",
    "& svg": {
      fontSize: "0.95rem",
    },
    "& .MuiTab-root": {
      fontSize: "0.8rem",
      gap: "4px",
    },
  },
  "& .MuiTabs-scrollButtons": {
    opacity: 0.6,
    width: "28px",
  },
};

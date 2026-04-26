import { Box, Divider, List, SxProps, Theme, Typography } from "@mui/material";
import SuccinctTimeReport from "../SuccinctTimeReport";
import { useMemo, useState } from "react";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

interface HomeRouteListDropDownProps {
  name: string;
  routeStrings: string;
  defaultExpanded?: boolean;
}

const HomeRouteListDropDown = ({
  name,
  routeStrings,
  defaultExpanded = true,
}: HomeRouteListDropDownProps) => {
  const [expaned, setExpanded] = useState<boolean>(defaultExpanded);
  const routes = useMemo(
    () => routeStrings.split("|").filter((v) => v) ?? [],
    [routeStrings]
  );
  if (routes.length === 0) {
    return <></>;
  }
  return (
    <Box sx={wrapperSx}>
      <Box sx={headerSx} onClick={() => setExpanded((prev) => !prev)}>
        <Box sx={headerLabelSx}>
          <Box sx={headerAccentSx} />
          <Typography variant="body2" fontWeight={700} sx={headerTitleSx}>
            {name}
          </Typography>
        </Box>
        <Box sx={chevronSx}>
          {!expaned ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ExpandLessIcon fontSize="small" />
          )}
        </Box>
      </Box>
      {expaned && (
        <List disablePadding>
          {routes.map(
            (selectedRoute, idx) =>
              Boolean(selectedRoute) && (
                <SuccinctTimeReport
                  key={`route-${name}-${idx}`}
                  routeId={selectedRoute}
                />
              )
          )}
        </List>
      )}
    </Box>
  );
};

export default HomeRouteListDropDown;

const wrapperSx: SxProps<Theme> = {
  borderRadius: "12px",
  overflow: "hidden",
  border: (theme) =>
    theme.palette.mode === "light"
      ? "1px solid rgba(0,0,0,0.08)"
      : "1px solid rgba(255,255,255,0.08)",
  mx: 1.5,
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 1.5,
  py: 1,
  cursor: "pointer",
  background: (theme) =>
    theme.palette.mode === "light"
      ? "rgba(0,0,0,0.03)"
      : "rgba(255,255,255,0.04)",
  "&:hover": {
    background: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(0,0,0,0.06)"
        : "rgba(255,255,255,0.08)",
  },
};

const headerLabelSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const headerAccentSx: SxProps<Theme> = {
  width: "4px",
  height: "16px",
  borderRadius: "2px",
  background: "#fedb00",
};

const headerTitleSx: SxProps<Theme> = {
  letterSpacing: "0.01em",
  fontSize: "0.82rem",
  textTransform: "uppercase",
};

const chevronSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  opacity: 0.5,
};

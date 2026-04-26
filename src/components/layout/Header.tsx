import { useEffect, useCallback, useContext, useRef } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Input,
  Toolbar,
  Typography,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Settings as SettingsIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  WbSunny as WbSunnyIcon,
  DarkMode as DarkModeIcon,
  WifiOff as WifiOffIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import AppContext from "../../context/AppContext";
import { vibrate, checkMobile } from "../../utils";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useWeatherCode, WeatherIcons } from "../Weather";
import useOnline from "../../hooks/useOnline";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";

const Header = () => {
  const {
    searchRoute,
    setSearchRoute,
    vibrateDuration,
    geoPermission,
    updateGeolocation,
    changeLanguage,
    _colorMode,
    toggleColorMode,
    isSearching,
    setIsSearching,
  } = useContext(AppContext);
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { t } = useTranslation();
  const language = useLanguage();
  let location = useLocation();
  const navigate = useNavigate();
  const weatherCodes = useWeatherCode();
  const onlineStatus = useOnline();
  const inputRef = useRef<HTMLInputElement>(null);
  const prevPathRef = useRef<string>(location.pathname);
  const switchedTab = useRef<boolean>(false);

  const handleLanguageChange = (lang: "zh" | "en") => {
    vibrate(vibrateDuration);
    navigate(location.pathname.replace("/" + language, "/" + lang), {
      replace: true,
    });
    changeLanguage(lang);
  };

  const relocateGeolocation = useCallback(() => {
    try {
      if (window.iOSRNWebView === true) return;
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          updateGeolocation({ lat: latitude, lng: longitude });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    } catch (e) {
      console.log("error in getting location");
    }
  }, [updateGeolocation]);

  const handleKeydown = useCallback(
    ({ key, ctrlKey, altKey, metaKey, target }: KeyboardEvent) => {
      // escape if key is functional
      if (ctrlKey || altKey || metaKey) return;
      // escape if any <input> has already been focused
      if ((target as HTMLElement).tagName.toUpperCase() === "INPUT") return;
      if ((target as HTMLElement).tagName.toUpperCase() === "TEXTAREA") return;

      if (key === "Escape") {
        setSearchRoute("");
      } else if (key === "Backspace") {
        setSearchRoute(searchRoute.slice(0, -1));
      } else if (key.length === 1) {
        setSearchRoute(searchRoute + key);
        navigate(`/${language}/board`, { replace: true });
      }
    },
    [searchRoute, language, setSearchRoute, navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  /**
   *  Detect if the previous path is different (i.e "/board")
   */
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      switchedTab.current = true;
      setIsSearching(false);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, setIsSearching]);

  const handleInputClick = () => {
    if (!inputRef.current) return;

    // If the user has switched tabs, turn on keypad
    if (switchedTab.current) {
      switchedTab.current = false;
      inputRef.current.focus();
      setIsSearching(true);
      return;
    }
    // Turning on/off the keypad
    if (isSearching) {
      inputRef.current.blur();
      setIsSearching(false);
    } else {
      inputRef.current.focus();
      setIsSearching(true);
    }
  };

  return (
    <Toolbar sx={rootSx}>
      <Link
        to={`/${language}`}
        onClick={(e) => {
          e.preventDefault();
          vibrate(vibrateDuration);
          navigate(`/${language}`);
        }}
        rel="nofollow"
        aria-label="Home"
      >
        {onlineStatus === "online" && <Box sx={appTitleSx} />}
        {onlineStatus === "offline" && (
          <IconButton>
            <WifiOffIcon />
          </IconButton>
        )}
        <Typography component="h1" style={visuallyHidden}>
          {t("巴士到站預報")}
        </Typography>
      </Link>
      <Input
        id="searchInput"
        sx={searchRouteInputSx}
        type="text"
        ref={inputRef}
        value={searchRoute}
        placeholder={t("路線")}
        startAdornment={
          <Box
            onClick={() => {
              setIsSearching(!isSearching);
            }}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            role="button"
            aria-label="Search Route"
            tabIndex={0}
          >
            <SearchIcon fontSize="small" sx={{ opacity: 0.8 }} />
          </Box>
        }
        onChange={(e) => {
          if (
            e.target.value.toUpperCase() in routeList ||
            e.target.value in routeList
          ) {
            (document.activeElement as HTMLElement).blur();
            navigate(`/${language}/route/${e.target.value}`);
          }
          setSearchRoute(e.target.value);
        }}
        onClick={handleInputClick}
        onFocus={() => {
          vibrate(vibrateDuration);
          if (navigator.userAgent !== "prerendering" && checkMobile()) {
            (document.activeElement as HTMLElement).blur();
          }
          navigate(`/${language}/board`, { replace: true });
        }}
        aria-label="search input, you may enter the route directly"
      />
      <Box sx={weatherPanelSx}>
        {weatherCodes.slice(0, 2).map((code) => (
          <Avatar
            onClick={() =>
              window.open(
                `https://www.hko.gov.hk/${
                  language === "zh" ? "tc" : "en"
                }/detail.htm`
              )
            }
            key={code}
            variant="square"
            src={WeatherIcons[code]}
            sx={weatherImg}
          />
        ))}
      </Box>
      <Box sx={funcPanelSx}>
        {geoPermission === "granted" && (
          <IconButton
            aria-label="relocate"
            onClick={() => relocateGeolocation()}
            size="small"
          >
            <LocationOnIcon />
          </IconButton>
        )}
        <Button
          sx={languageSx}
          onClick={() => handleLanguageChange(language === "zh" ? "en" : "zh")}
          id="lang-selector"
          variant="text"
          disableElevation
          disableRipple
          aria-label="Language button"
        >
          {language !== "zh" ? "繁" : "En"}
        </Button>
        <IconButton
          onClick={() => {
            vibrate(vibrateDuration);
            toggleColorMode();
          }}
          aria-label="color theme button"
        >
          {_colorMode === "system" && (
            <SettingsBrightnessIcon fontSize="small" />
          )}
          {_colorMode === "light" && <WbSunnyIcon fontSize="small" />}
          {_colorMode === "dark" && <DarkModeIcon fontSize="small" />}
        </IconButton>
        <IconButton
          component={Link}
          to={`/${language}/settings`}
          rel="nofollow"
          aria-label="settings button"
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Box>
    </Toolbar>
  );
};

export default Header;

const rootSx: SxProps<Theme> = {
  "& a": {
    textDecoration: "none",
  },
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  px: 1.5,
  py: 0.75,
  minHeight: "52px",
  borderBottom: (theme) =>
    theme.palette.mode === "light"
      ? "1px solid rgba(0,0,0,0.08)"
      : "1px solid rgba(255,255,255,0.08)",
  background: (theme) =>
    theme.palette.mode === "light" ? "#fff" : theme.palette.background.default,
};

const appTitleSx: SxProps<Theme> = {
  backgroundImage: (t) =>
    t.palette.mode === "light"
      ? "url(/img/logo128.png)"
      : "url(/img/dark-32.jpg)",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  width: 36,
  height: 36,
};

const searchRouteInputSx: SxProps<Theme> = {
  maxWidth: "110px",
  borderRadius: "8px",
  px: 1,
  py: 0.25,
  background: (theme) =>
    theme.palette.mode === "light"
      ? "rgba(0,0,0,0.06)"
      : "rgba(255,255,255,0.08)",
  "& input": {
    textAlign: "center",
    fontSize: "0.875rem",
    py: 0.5,
  },
  "&::before, &::after": {
    display: "none",
  },
  "&.Mui-focused": {
    outline: (theme) => `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "-2px",
  },
};

const weatherPanelSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};

const funcPanelSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.25,
};

const languageSx: SxProps<Theme> = {
  color: (theme) => theme.palette.text.primary,
  minWidth: "36px",
  px: 0.75,
  py: 0.5,
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "0.8rem",
  textTransform: "none",
  "&:hover": {
    background: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(0,0,0,0.06)"
        : "rgba(255,255,255,0.08)",
  },
};

const weatherImg: SxProps<Theme> = {
  background: "transparent",
  height: 26,
  width: 26,
};

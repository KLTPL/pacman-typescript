import getInitGameConfig from "./config/gameConfig";
import Controller from "./scripts/controller/Controller";
import "./style.css";

const gameConfig = getInitGameConfig();

const gameController = new Controller(gameConfig);

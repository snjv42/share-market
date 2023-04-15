import { createContext } from "react";
import defaultContext from "./context/defaults";

const AuthContextProvider = createContext(defaultContext);

export default AuthContextProvider;

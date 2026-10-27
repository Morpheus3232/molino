import "server-only";
import { CONTENT_DICT_EN } from "./index";

// Server Components no tienen contexto de React: el diccionario completo se
// registra una vez por proceso y `useL()` lo lee de acá.
(globalThis as { __MOLINO_CONTENT_DICT__?: unknown }).__MOLINO_CONTENT_DICT__ = CONTENT_DICT_EN;

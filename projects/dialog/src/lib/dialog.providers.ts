import { Provider } from "@angular/core";
import { DialogGlobalConfig } from "./dialog.interfaces";
import { DIALOG_GLOBAL_CONFIG } from "./dialog.tokens";

export function provideDialogConfig(config: DialogGlobalConfig): Provider {
    return {
        provide: DIALOG_GLOBAL_CONFIG,
        useValue: config
    };
}

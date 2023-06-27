import React, { useEffect } from "react";
import { createApp } from "@vue/runtime-dom";
import 'zone.js';
import "@angular/compiler";
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Component, importProvidersFrom } from '@angular/core';
import { SvelteComponentTyped } from "svelte";

export function vueWrapper(vueComponent: any) {
    return (props: Record<string, any>) => {
        useEffect(() => {
            createApp(vueComponent, props).mount(".vue-root");
        }, []);
        return <div className="vue-root"></div>;
    };
}

export function svelteWrapper(svelteComponent: any) {
    return (props: Record<string, any>) => {
        useEffect(() => {
            const component: SvelteComponentTyped = new svelteComponent({
                target: document.querySelector(".svelte-root"),
                props,
            });
            // component.$set(props);
            // Object.entries(on).forEach(([event, handler]) =>
            //   component.$on(event, handler)
            // );

            return () => {
                component.$destroy();
            };
        }, []);
        return <div className="svelte-root"></div>;
    }
}

export function angularWrapper(angularComponent: any) {
    return (props: Record<string, any>) => {
        useEffect(() => {
            const declaredInputs = angularComponent.ɵcmp.declaredInputs;
            const keys = Object.keys(props).filter(propName => declaredInputs[propName]);
            @Component({
                selector: "app-root",
                standalone: true,
                template: `<ngx-app ${keys.map(propName => `[${propName}]="${propName}"`).join(" ")}></ngx-app>`,
                imports: [angularComponent],
            })
            class NgxRootComponent {
                constructor() {
                    for (const name in props) {
                        (this as any)[name] = props[name];
                    }
                }
            }

            const ref = bootstrapApplication(NgxRootComponent, {
                providers: [importProvidersFrom(HttpClientModule)],
            });

            return () => {
                ref.then(r => r.destroy());
            }
        }, []);

        return <div className="angular-root">
            <app-root />
        </div>;
    };
}

export const scriptWrapper = (scriptComponent: any, html: string) => {

    return (props: Record<string, any>) => {
        useEffect(() => {
            return scriptComponent(props);
        }, []);
        return <div className="script-root" dangerouslySetInnerHTML={{ __html: html }}>
        </div>;
    }
};

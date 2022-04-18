import { EstatusSelectComponent } from "src/app/components/estatus-select-component/estatus-select.component";
import { InputprogramasComponent } from "src/app/components/inputprogramas/inputprogramas.component";
import { NumberComponentDynamicComponent } from "src/app/components/number-component-dynamic/number-component-dynamic.component";
import { SmartTableDatepickerComponentTime } from "src/app/components/smart-table-datepicker-time/smart-table-datepicker-time.component";
import { SmartTableDatepickerComponent } from "src/app/components/smart-table-datepicker/smart-table-datepicker.component";
import { SmatTablePickerDatetimeComponent } from "src/app/components/smat-table-picker-datetime/smat-table-picker-datetime.component";

export const getSettigs = function () {
    var tabla = {
        actions: {
            columnTitle: 'Opciones',
            width: '2%',
            add: true,
            edit: true,
            delete: false,
        },
        add: {
            addButtonContent: '<i class="material-icons-outlined add">add_box</i>',
            createButtonContent: '<i class="material-icons-outlined">save</i>',
            cancelButtonContent: '<i class="material-icons-outlined">close</i>',
            confirmCreate: true
        },
        edit: {
            editButtonContent: '<i class="material-icons-outlined">edit</i>',
            saveButtonContent: '<i class="material-icons-outlined">save</i>',
            cancelButtonContent: '<i class="material-icons-outlined">close</i>',
            confirmSave: true
        },
        delete: {
            deleteButtonContent: '<i class="material-icons-outlined">delete</i>',
        },
        attr: {
            class: 'table table-bordered responsive'
        },
        pager: {
            perPage: 10,
        },
        columns: {
            id_programacion: {
                title: 'ID',
                type: 'string',
                width: '8%',
                editable: false,
                addable: false,
                filter: false
            },
            nombre_plan_estudio: {
                title: 'Plan de estudios',
                type: 'html',
                editor: {
                    type: 'custom',
                    component: InputprogramasComponent,
                },
                width: '20%',
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Todos los programas',
                        list: [],
                    },
                },
            },
            fecha_programada: {
                title: 'Fecha del evento',
                type: 'string',
                width: '15%',
                filter: true,
                editor: {
                    type: 'custom',
                    component: SmartTableDatepickerComponent,
                    config: {
                        placeholder: 'End Time'
                    }
                },
            },
            hora: {
                title: 'Hora del evento',
                type: 'html',
                width: '15%',
                filter: true,
                editor: {
                    type: 'custom',
                    component: SmartTableDatepickerComponentTime,
                    config: {
                        placeholder: 'End Time'
                    }
                }
            },
            fecha_caducidad_registro: {
                title: 'Fecha de caducidad',
                type: 'string',
                width: '15%',
                filter: true,
                editor: {
                    type: 'custom',
                    component: SmatTablePickerDatetimeComponent,
                    config: {
                        placeholder: 'End Time'
                    }
                },
            },
            maximo_asistentes: {
                title: 'Máximo de asistentes',
                type: 'string',
                width: '15%',
                editor: {
                    type: 'custom',
                    component: NumberComponentDynamicComponent,
                }
            },
            estatus: {
                title: 'Estatus',
                type: 'html',
                editor: {
                    type: 'custom',
                    component: EstatusSelectComponent,
                },
                width: '15%',
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Todos',
                        list: [{ value: 'Activo', title: 'Activos' }, { value: 'Desactivado', title: 'Desactivados' }],
                    },
                },
            }
        }
    }

    return tabla
}
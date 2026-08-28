import { api } from 'boot/axios'

export function getAdminReportSummary(){
    return api.get('/admin/reports/summary')
}
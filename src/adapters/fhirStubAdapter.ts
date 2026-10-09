import { PrescribedItem } from '../types/drug';
import { PatientInfo } from '../types/patient';

export function convertToFhirMedicationRequest(patient: PatientInfo, item: PrescribedItem): any {
  return {
    resourceType: 'MedicationRequest',
    id: `medrx-${item.id}`,
    status: 'active',
    intent: 'order',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/medicationrequest-category',
            code: 'outpatient',
            display: 'Outpatient TTM Clinic',
          },
        ],
      },
    ],
    medicationCodeableConcept: {
      coding: [
        {
          system: 'https://thcc.or.th/ttmt',
          code: item.herb.drug_code_24,
          display: item.herb.thai_name,
        },
        {
          system: 'https://moph.go.th/tmt',
          code: item.herb.ttmt_id,
          display: item.herb.common_name,
        },
      ],
      text: `${item.herb.thai_name} (${item.herb.strength_per_unit})`,
    },
    subject: {
      reference: `Patient/${patient.hn}`,
      display: patient.name,
    },
    dosageInstruction: [
      {
        text: item.instructions,
        timing: {
          repeat: {
            frequency: item.frequency_per_day,
            period: 1,
            periodUnit: 'd',
          },
        },
        route: {
          text: item.route,
        },
        doseAndRate: [
          {
            doseQuantity: {
              value: item.dose_per_admin,
              unit: item.herb.unit,
            },
          },
        ],
      },
    ],
    dispenseRequest: {
      numberOfRepeatsAllowed: 0,
      quantity: {
        value: item.total_quantity,
        unit: item.herb.unit,
      },
      expectedSupplyDuration: {
        value: item.days,
        unit: 'days',
      },
    },
  };
}

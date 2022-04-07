# MODAL VIEW

action button on datatable > view

ganito yung magiging example format pag inayos yung view modals

(view modal sa medications)

sa loob ng div.modal-body
```
<p>Medication Details</p>
                    <div class = "table-responsive">
                        <table class="table">
                            <tr>
                                <th>Drug Name:</th>
                                <td><span id="v_drug_name"></span></td>
                            </tr>
                            <tr>
                                <th>Dosage:</th>
                                <td><span id="v_dosage"></span></td>
                            </tr>
                            <tr>
                                <th>Route:</th>
                                <td><span id="v_route"></span></td>
                            </tr>
                            <tr>
                                <th>Frequency:</th>
                                <td><span id="v_frequency"></span></td>
                            </tr>
                            <tr>
                                <th>Quantity:</th>
                                <td><span id="v_quantity"></span></td>
                            </tr>
                            <tr>
                                <th>Medication Status:</th>
                                <td><span id="v_medication_status"></span></td>
                            </tr>
                            <tr>
                                <th>Refill:</th>
                                <td><span id="v_refill"></span></td>
                            </tr>
                            <tr>
                                <th>Instructions:</th>
                                <td><span id="v_instructions"></span></td>
                            </tr>
                            <tr>
                                <th>Start Date:</th>
                                <td><span id="v_start_date"></span></td>
                            </tr>
                            <tr>
                                <th>End Date:</th>
                                <td><span id="v_end_date"></span></td>
                            </tr>
                        </table>
                    </div>
```


# Danica

View modals :

    Allergy
        view modal dir:
            templates > recordModals > Allergy.html > line 101
        view ajax dir:
            static > recordsAJAX > allergy.js > function editAllergenModal
    Medical Problem
        view modal dir:
            templates > recordModals > MedicalProblem.html >  line 112
        view ajax dir:
            static > recordsAJAX > medicalProblem.js > function editProblemModal
    Diagnostic Result
        view modal dir:
            templates > recordModals > DiagnosticResult.html >  line 95
        view ajax dir:
            static > recordsAJAX > medicalDiagnosis.js > function editDiagnosicResultModal
    Laboratory Result
        view modal dir:
            templates > recordModals > Laboratory.html >  line 140
        view ajax dir:
            static > recordsAJAX > labResult.js > function editLabResultModal

note: wag palitan yung id ehe, tenkyu

# ALBERT

    Progress Notes
        view modal dir:
            templates > recordModals > ClinicalNotes.html >  line 121
        view ajax dir:
            static > recordsAJAX > clinicalNotes.js > function editProgressNoteModal
    Prescription (Drug)
        view modal dir:
            templates > recordModals > Prescription.html >  line 354
        view ajax dir:
            static > recordsAJAX > prescription.js > function DrugPrescriptionModal
    Prescription (Supply)
        view modal dir:
            templates > recordModals > Prescription.html >  line 209
        view ajax dir:
            static > recordsAJAX > prescription.js > function editPrescriptionModal
    Discharge
        view modal dir:
            templates > recordModals > PatientDischarge.html >  line 211
        view ajax dir:
            static > recordsAJAX > patientDischarge.js > function editPatientDischargeModal

note: wag palitan yung id ehe, tenkyu
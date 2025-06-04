import {
    allSubjects,
    mainSubjects,
    type Grade,
    type GradeResponse,
    type GradeSubmission,
    type GradeSubmissionMap,
    type NoteNumber,
    type NoteString,
    type Subject,
} from './types';

function toGradeSubmissionMap(arr: GradeSubmission): GradeSubmissionMap {
    const map = {} as GradeSubmissionMap;
    for (const grade of arr) {
        const subject = grade.subject as Subject;
        if (map[subject]) {
            throw new Error(`Duplicate grade for subject: ${subject}`);
        }
        map[subject] = grade;
    }

    for (const subj of allSubjects) {
        if (!map[subj]) {
            throw new Error(`Missing grade for subject: ${subj}`);
        }
    }
    return map;
}

const NOTE_ORDER: NoteString[] = [
    '1+',
    '1',
    '1-',
    '2+',
    '2',
    '2-',
    '3+',
    '3',
    '3-',
    '4+',
    '4',
    '4-',
    '5+',
    '5',
    '5-',
    '6',
];

function noteStringToNumber(note: NoteString): NoteNumber {
    const index = NOTE_ORDER.indexOf(note);
    return (NOTE_ORDER.length - 1 - index) as NoteNumber;
}

function noteNumberToString(num: NoteNumber): NoteString {
    return NOTE_ORDER[NOTE_ORDER.length - 1 - num];
}

function computeAverage(grades: GradeSubmissionMap): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const subject of Object.keys(grades) as Subject[]) {
        const gradeObj: Grade = grades[subject];
        const weight: number = gradeObj.weight || 1;
        if (!gradeObj.note) throw new Error(`Missing note for subject: ${subject}`);

        weightedSum += noteStringToNumber(gradeObj.note) * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

function computeMainSubjectPassing(grades: GradeSubmissionMap): Subject[] {
    return mainSubjects.filter((subject) => {
        const grade = grades[subject];
        if (!grade.note) throw new Error(`Missing note for main subject: ${subject}`);
        return noteStringToNumber(grade.note) <= 3;
    });
}

function computeOtherSubjectPassing(grades: GradeSubmissionMap): Subject[] {
    const otherSubjects: Subject[] = allSubjects.filter((subj) => !mainSubjects.includes(subj));
    return otherSubjects.filter((subject) => {
        const grade = grades[subject];
        if (!grade.note) throw new Error(`Missing note for main subject: ${subject}`);
        return noteStringToNumber(grade.note) <= 3;
    });
}

export function computePassing(arr: GradeSubmission): GradeResponse {
    const grades = toGradeSubmissionMap(arr);
    let passing = false;
    let feedback: string[] = [];
    const tempAvg = Math.round(computeAverage(grades)) as NoteNumber;
    const average: NoteString = noteNumberToString(tempAvg);

    const mainSubjectFailing = computeMainSubjectPassing(grades);
    const mainSubjectPassing = mainSubjectFailing.length < 2;

    const otherSubjectFailing = computeOtherSubjectPassing(grades);

    passing = tempAvg >= 5 && mainSubjectPassing; //

    if (!passing) {
        feedback.push(`Durchschnitt: ${average}`);
        if (mainSubjectFailing.length > 0) {
            feedback.push(`Hauptfächer nicht bestanden: ${mainSubjectFailing.join(', ')}`);
        }
        if (otherSubjectFailing.length > 0) {
            feedback.push(`Nebenfächer nicht bestanden: ${otherSubjectFailing.join(', ')}`);
        }
        return {
            passing: false,
            average: average,
            feedback: feedback,
        } as GradeResponse;
    }
    return {
        passing: true,
        average: average,
    } as GradeResponse;
}

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

const noteStringToNumberMap: Record<NoteString, NoteNumber> = {
    '1+': 15,
    '1': 14,
    '1-': 13,
    '2+': 12,
    '2': 11,
    '2-': 10,
    '3+': 9,
    '3': 8,
    '3-': 7,
    '4+': 6,
    '4': 5, // passing??
    '4-': 4,
    '5+': 3,
    '5': 2,
    '5-': 1,
    '6': 0,
};
//es tut mir so leid es ist so hässlich aber ich hatte keinen bock
const noteNumberToStringMap: Record<NoteNumber, NoteString> = {
    15: '1+',
    14: '1',
    13: '1-',
    12: '2+',
    11: '2',
    10: '2-',
    9: '3+',
    8: '3',
    7: '3-',
    6: '4+',
    5: '4', // passing??
    4: '4-',
    3: '5+',
    2: '5',
    1: '5-',
    0: '6',
};

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

function noteStringToNumber(note: NoteString): NoteNumber {
    return noteStringToNumberMap[note];
}
function noteNumberToString(note: NoteNumber): NoteString {
    return noteNumberToStringMap[note];
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

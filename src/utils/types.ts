export type Level = 'E' | 'G';

export type NoteString =
    | '1-'
    | '1'
    | '1+'
    | '2-'
    | '2'
    | '2+'
    | '3-'
    | '3'
    | '3+'
    | '4-'
    | '4'
    | '4+'
    | '5-'
    | '5'
    | '5+'
    | '6';

export type NoteNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export const mainSubjects: Subject[] = ['mathe', 'deutsch', 'englisch'];

export const allSubjects = [
    'mathe',
    'deutsch',
    'englisch',
    'biologie',
    'chemie',
    'physik',
    'wuk',
    'kunst',
    'sport',
    'musik',
];
export type Subject = (typeof allSubjects)[number];

export type Grade = {
    subject: Subject;
    level?: Level;
    note?: NoteString;
    weight?: number;
    zap?: NoteString;
    projekt?: NoteString;
};

export type GradeSubmission = Grade[];

export type GradeSubmissionMap = {
    [key in Subject]: Grade;
};

export type GradeResponse = { passing: true; average: number } | { passing: false; average: number; feedback: string };

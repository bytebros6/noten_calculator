export type kurs_art = "E" | "G";

export type note_string = "1-" | "1" | "1+" | "2-" | "2" | "2+" | "3-" | "3" | "3+" | "4-" | "4" | "4+" | "5-" | "5" | "5+" | "6";

export type note_number = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type Grade = {
    level: kurs_art;
    note: note_string;
    weight: number;
    zap: note_string | null;
    projekt: note_string | null;
}

export type Subject =
  | "mathe"
  | "deutsch"
  | "englisch"
  | "biologie"
  | "chemie"
  | "physik"
  | "wuk"
  | "kunst"
  | "sport"
  | "musik";

export type GradeSubmission = {
    [key in Subject]: Grade;
}

export type GradeResponse = 
    | { success: true }
    | { success: false; error: string };
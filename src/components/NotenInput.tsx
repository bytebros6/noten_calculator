import { Input } from '@/components/ui/input';
import { allNotes, type Grade, type Subject } from '@/utils/types';

type Props = {
    grade: Grade | undefined;
    type: 'note' | 'zap' | 'projekt';
    setGradeField: (subject: Subject, field: 'note' | 'zap' | 'projekt', value: string) => void;
};

const NotenInput = ({ grade, type, setGradeField }: Props) => {
    const note = grade?.[type] ?? '';

    return (
        <Input
            value={note}
            onChange={(e) => {
                if (grade) setGradeField(grade.subject, type, e.target.value);
            }}
            placeholder="Note"
            className={`h-8 w-24 ${grade && !allNotes.includes(note) ? 'border-destructive' : ''}`}
            disabled={!grade}
        />
    );
};

export default NotenInput;

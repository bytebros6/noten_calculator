import { Input } from '@/components/ui/input';
import { allNotes, type Grade, type Subject } from '@/utils/types';

type Props = {
    grade: Grade;
    type: 'note' | 'zap';
    setGradeField: (subject: Subject, field: 'note' | 'zap', value: string) => void;
};

const NotenInput = ({ grade, type, setGradeField }: Props) => {
    const note = type === 'note' ? grade.note ?? '' : grade.zap ?? '';

    return (
        <Input
            value={note}
            onChange={(e) => setGradeField(grade.subject, type, e.target.value)}
            list="noten-options"
            placeholder="Note"
            className={`h-8 w-24 ${!allNotes.includes(note) ? 'border-destructive' : ''}`}
        />
    );
};

export default NotenInput;

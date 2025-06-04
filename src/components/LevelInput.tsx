import { Checkbox } from '@/components/ui/checkbox';
import { type Grade, type Level, type Subject } from '@/utils/types';

type Props = {
    grade: Grade;
    level: Level;
    setGradeLevel: (subject: Subject, newLevel: Level) => void;
};

const LevelInput = ({ grade, level, setGradeLevel }: Props) => (
    <Checkbox
        className={grade.level === undefined ? 'border-destructive' : ''}
        onClick={() => setGradeLevel(grade.subject, level)}
        checked={grade.level === level}
    />
);

export default LevelInput;

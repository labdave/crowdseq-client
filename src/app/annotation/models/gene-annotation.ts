import { UserInfo } from 'src/app/shared/models/user-info';

export class GeneAnnotation {
    id: string;
    annotation: string;
    creation_timestamp: Date;
    score: number;
    gene: number;
    user: UserInfo;
}

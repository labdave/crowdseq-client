import { UserInfo } from 'src/app/shared/models/user-info';

export class AAAnnotation {
    id: string;
    annotation: string;
    creation_timestamp: Date;
    score: number;
    priority: number;
    amino_acid: number;
    gene: number;
    user: UserInfo;
    tier: string;
    tier_summary: string;
}

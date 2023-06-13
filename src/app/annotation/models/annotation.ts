import { UserInfo } from 'src/app/shared/models/user-info';

export class Annotation {
    public static readonly TIER_LIST = [
      { name: 'Tier 1', value: '1' },
      { name: 'Tier 2', value: '2' },
      { name: 'Tier 3', value: '3' },
      { name: 'Tier 4', value: '4' }
    ];

    id: string;
    variant: string;
    tier: string;
    tier_summary: string;
    gene_level: string;
    variant_level: string;
    reference_text: string;
    treatment: string;
    clinical_trial: string;
    user: UserInfo;
    creation_timestamp: Date;
    valid_to: Date;
    copied_from: Annotation;

    // used to mark if the current user is the owner of the annotation
    ownsAnnotation = false;
    defaultAnnotation = false;
}

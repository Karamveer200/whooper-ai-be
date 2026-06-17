export declare const FIELD_LIMITS: {
    readonly submission: {
        readonly minChars: 10;
        readonly maxWords: 2000;
        readonly maxUrlLength: 2048;
    };
    readonly task: {
        readonly title: {
            readonly min: 3;
            readonly max: 200;
        };
        readonly category: {
            readonly min: 1;
            readonly max: 100;
        };
        readonly description: {
            readonly min: 10;
            readonly max: 5000;
        };
        readonly criterion: {
            readonly min: 1;
            readonly max: 500;
        };
        readonly maxCriteria: 20;
        readonly skill: {
            readonly max: 50;
        };
        readonly maxSkills: 20;
        readonly payout: {
            readonly min: 0.01;
            readonly max: 1000000;
        };
        readonly roughIdea: {
            readonly min: 10;
            readonly max: 5000;
        };
    };
};
export declare const countWords: (text: string) => number;
export declare const isWithinWordLimit: (text: string, maxWords: number) => boolean;

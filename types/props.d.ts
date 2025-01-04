declare type PC<T = {}> = Readonly<React.PropsWithChildren<T>>;
declare type P<T> = Readonly<T>;

declare type DialogProps<T = {}> = {
	open: boolean;
	onClose: () => void;
} & T;

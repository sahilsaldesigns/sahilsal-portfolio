export const Container = ({children , ...props}) => {
    return <div className="w-full max-w-[766px] px-4 mx-auto" {...props}>
        {children}
    </div>
}
export const getTeamLogoUrl = (teamName) => {
    if (!teamName) return '';
    const name = encodeURIComponent(teamName);
    // Using UI Avatars with a consistent style that matches the black/white theme
    // background=000000 (Black), color=ffffff (White), bold=true
    return `https://ui-avatars.com/api/?name=${name}&background=000000&color=ffffff&bold=true&size=128&length=2`;
};

export const getUserAvatarUrl = (userName) => {
    if (!userName) return '';
    const name = encodeURIComponent(userName);
    return `https://ui-avatars.com/api/?name=${name}&background=f4f4f5&color=000000&bold=true&size=128`;
};

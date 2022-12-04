import filter from "@script/resolver/filter"

test('testFilter-github', () => {
    // Filter while editing file on github
    // Not filter while creating issues
    expect(filter('github.com', 'https://github.com/sheepzh/poetry/edit/master/README.md')).toBeTruthy()
    expect(filter('github.com', 'https://github.com/sheepzh/poetry')).toBeFalsy()
})
class save {
    static save(file_name, text) {
        let element = html.CreateElement('a', {}, "body");

        // element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        // element.setAttribute("download", file_name);
        console.log("" + text + "");
        let blob = new Blob([text], { type: "text/plain" });
        element.href = URL.createObjectURL(blob);
        element.download = file_name;
        element.click();
    }
}
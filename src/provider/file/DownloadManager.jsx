const baseUrl = process.env.REACT_APP_API_GATEWAY;

export const download = (url, payload) => {
    const form = document.createElement("form");

    form.method = "POST";
    form.action = baseUrl + url;
    form.style.display = "none";

    Object.entries(payload).forEach(([key, value]) => {

        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = value;

        form.appendChild(input);

    });

    document.body.appendChild(form);

    form.submit();

    document.body.removeChild(form);
}
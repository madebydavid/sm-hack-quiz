module.exports = function(rawItem) {

    let attributes = rawItem.attributes;

    let simpleItem = {
        id: rawItem.id,
        image: attributes.multimedia[0].processed.large_thumbnail.location,
        description: null
    };

    let descriptions = rawItem.attributes.description;

    let webDescription = descriptions.find((desc) => {
        return desc.type == 'web description'
    });

    // some dont have the web description - just the the first in this scenario
    if (!webDescription) {
        webDescription = descriptions[0];
    }

    simpleItem.description = webDescription.value;

    return simpleItem;

};
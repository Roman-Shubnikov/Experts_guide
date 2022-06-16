import React from 'react';
import PropTypes from 'prop-types'
import {
    HorizontalCell,

} from "@vkontakte/vkui"


const CardGalery = props => {
    const { img, type, href, onClick } = props;
    return(
        <HorizontalCell size='l'
        className='card_image_cell'
        hasHover={false}
        hasActive={false}
        onClick={type === 'button' ? onClick : undefined}
        href={type === 'link' ? href : undefined}
        target="_blank" rel="noopener noreferrer">
            <img src={img}
            className='card_image' 
            alt=':-(' />
        </HorizontalCell>
    )
}

CardGalery.propTypes = {
    img: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    href: PropTypes.string,
    onClick: PropTypes.func
}

export default CardGalery;